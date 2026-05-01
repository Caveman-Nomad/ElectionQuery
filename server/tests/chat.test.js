const request = require('supertest');
const app = require('../index');

describe('POST /api/chat', () => {
  it('should return 400 if messages array is missing', async () => {
    const res = await request(app)
      .post('/api/chat')
      .send({ stateContext: 'Delhi' });
    
    expect(res.statusCode).toEqual(400);
    expect(res.body).toHaveProperty('error');
    expect(res.body.error).toBe("Invalid messages array.");
  });

  it('should return 400 if stateContext is missing', async () => {
    const res = await request(app)
      .post('/api/chat')
      .send({ messages: [{ sender: 'user', text: 'hello' }] });
    
    expect(res.statusCode).toEqual(400);
    expect(res.body).toHaveProperty('error');
    expect(res.body.error).toBe("Invalid state context.");
  });

  // We mock the geminiService to test the success path without burning API quota
  it('should return 200 and mocked response on valid request', async () => {
    const geminiService = require('../services/geminiService');
    jest.spyOn(geminiService, 'generateChatResponse').mockResolvedValue('Mocked response');

    const res = await request(app)
      .post('/api/chat')
      .send({ 
        messages: [{ sender: 'user', text: 'hello' }],
        stateContext: 'Delhi'
      });
    
    expect(res.statusCode).toEqual(200);
    expect(res.body.text).toBe('Mocked response');
  });
});
