import mongoose from 'mongoose';
import express, { Request, Response } from 'express';
import { NotFoundError, OrderStatus, requireAuth, validateRequest, BadRequestError } from '@satyabitmca/common';
import { body } from 'express-validator';
import { Ticket } from '../models/ticket';
import { Order } from '../models/order';
import { OrderCreatedPublisher } from '../events/publishers/order-created-publisher';
import { natsWrapper } from '../nats-wrapper';

const router = express.Router();

const EXPIRATION_WINDOW_SECONDS = 1 * 60;

router.post('/api/orders',requireAuth,[
  body('ticketId')
  .not()
  .isEmpty()
  .custom((input: string) => mongoose.Types.ObjectId.isValid(input))
  .withMessage('TicketId is required')

], validateRequest,
async (req: Request, res: Response) => {

  const { ticketId } = req.body;
 
  // find the ticket the user is trying to order in the database
  const ticket = await Ticket.findById(ticketId);
  if(!ticket){
    throw new NotFoundError();
  } 

   // if we find an order from that means the ticket is reserved  
  const isReserved = await ticket.isReserved(); 
  if(isReserved){
    throw new BadRequestError('Ticket is already reserved');
  } 

  // calculate an expiration date for this order
   const expiration = new Date();
   // console.log('current time on server side when order created: ',expiration)
   expiration.setSeconds(expiration.getSeconds() + EXPIRATION_WINDOW_SECONDS);


  // build the order and save it to the database
   const order = Order.build({
    userId: req.currentUser!.id,
    status: OrderStatus.Created,
    expiresAt: expiration,
    ticket
   });

   await order.save();

   console.log('saved expired time in database: ', order.expiresAt.toISOString());
  // publish an event saying that an order was created
   new OrderCreatedPublisher(natsWrapper.client).publish({
    id:order.id,
    version: order.version,
    status: order.status,
    userId: order.userId,
    expiresAt: order.expiresAt.toISOString(),
    // expiresAt: order.expiresAt.toLocaleString(),
    ticket: {
      id: ticket.id,
      price: ticket.price
    }
   });
    
  res.status(201).send(order);
  
});

export { router as newOrderRouter };