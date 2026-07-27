import { cookies } from 'next/headers';

import axios from 'axios';

import { API_BASE_URL, SESSION_COOKIE_KEY } from '../config';

import 'server-only';

export const serverAxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
});

serverAxiosInstance.interceptors.request.use(async (config) => {
  const session = (await cookies()).get(SESSION_COOKIE_KEY)?.value;

  if (session) {
    config.headers.Cookie = `${SESSION_COOKIE_KEY}=${session}`;
  }

  return config;
});

// 서버에는 세션 갱신 메커니즘이 없음 — 만료되면 401/403을 그대로 던지고 클라이언트가 재로그인을 유도함.
serverAxiosInstance.interceptors.response.use((response) => response.data);
