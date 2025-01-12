import request from 'supertest';
import { app } from '../../app';
import { response } from 'express';

it('fails when a email that does not exist is supplied', async () => {
    await request(app)
          .post('/api/users/signin')
          .send( {
            email: 'test@test.com',
            password: 'password'
          })
          .expect(400);
});

it('fails when an incorrect password is supplied', async() => {
        await request(app)
                .post('/api/users/signup')
                .send({
                    email: 'test@test.com',
                    password: 'password'
                })
                .expect(201);

            await request(app)
                .post('/api/users/signin')
                .send({
                    email: 'test@test.com',
                    password: 'passwordpassword'
                })
                .expect(400);
});

it('responds with a cookie when given valid credentials', async ()=> {

    await request(app)
                .post('/api/users/signup')
                .send({
                    email: 'test@test.com',
                    password: 'password'
                })
                .expect(201);

            await request(app)
                .post('/api/users/signin')
                .send({
                    email: 'test@test.com',
                    password: 'password'
                })
                .expect(200);

                const cookie = response.get('Set-Cookie');
                if(!cookie) {
                    throw new Error('Expected cookie but got undefined');
                }
    
                expect(cookie[0]).toEqual(
                    'session=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; httponly'
                );

       // expect(response.get('Set-Cookie')).toBeDefined();

})