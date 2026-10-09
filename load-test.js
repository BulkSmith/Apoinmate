import http from 'k6/http';
import { check, sleep } from 'k6';

export const options = {
  stages: [
    { duration: '30s', target: 10 },
    { duration: '1m', target: 50 },
    { duration: '1m', target: 100 },
    { duration: '30s', target: 0 },
  ],

  thresholds: {
    http_req_failed: ['rate<0.05'],
    http_req_duration: ['p(95)<2000'],
  },
};

export default function () {
  const response = http.get('https://apoinmate.vercel.app/');

  check(response, {
    'status is 200': (r) => r.status === 200,
    'page loaded': (r) => r.body.length > 0,
  });

  sleep(1);
}