// src/__tests__/index.test.ts
import request from 'supertest';
import { CredentialStore } from '../store/credentialStore';
import { jest, describe, it, beforeEach, expect } from '@jest/globals';
import app from '../index'; // make sure app is exported without calling listen() for tests

// Mock UUID for consistent testing
jest.mock('uuid', () => ({
  v4: () => 'test-uuid'
}));

describe('Credential Service', () => {
  const testCredential = {
    name: "John Doe",
    type: "Identity",
    details: {
      age: 30,
      country: "USA"
    }
  };

  beforeEach(() => {
    // Reset credential store between tests
    const store = CredentialStore.getInstance();
    // @ts-ignore - accessing private property for testing
    store.credentials = new Map();
  });

  describe('POST /api/issue', () => {
    it('should issue a new credential', async () => {
      const res = await request(app)
        .post('/api/issue')
        .set('Content-Type', 'application/json')
        .send(testCredential);

      expect(res.status).toBe(201);
      expect(res.body.message).toBe('Credential issued successfully');
      expect(res.body.credential).toMatchObject({
        id: 'test-uuid',
        data: testCredential,
        issuedBy: 'worker-local'
      });
    });

    it('should not issue duplicate credentials', async () => {
      // Issue first credential
      await request(app)
        .post('/api/issue')
        .set('Content-Type', 'application/json')
        .send(testCredential);

      // Attempt to issue duplicate
      const res = await request(app)
        .post('/api/issue')
        .set('Content-Type', 'application/json')
        .send(testCredential);

      expect(res.status).toBe(409);
      expect(res.body.message).toBe('Credential already exists');
    });
  });

  describe('POST /api/verify', () => {
    it('should verify an existing credential', async () => {
      // First issue a credential
      await request(app)
        .post('/api/issue')
        .set('Content-Type', 'application/json')
        .send(testCredential);

      // Then verify it
      const res = await request(app)
        .post('/api/verify')
        .set('Content-Type', 'application/json')
        .send(testCredential);

      expect(res.status).toBe(200);
      expect(res.body.isValid).toBe(true);
      expect(res.body.credential).toMatchObject({
        id: 'test-uuid',
        data: testCredential,
        issuedBy: 'worker-local'
      });
    });

    it('should return 404 for non-existent credential', async () => {
      const res = await request(app)
        .post('/api/verify')
        .set('Content-Type', 'application/json')
        .send(testCredential);

      expect(res.status).toBe(404);
      expect(res.body.message).toBe('Credential not found');
    });
  });
});
