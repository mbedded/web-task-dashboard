import { test, expect, describe } from "@jest/globals";
import { TracksAdapter } from "./TracksAdapter";
import type { RequestUrlParam, RequestUrlResponse, RequestUrlResponsePromise } from "obsidian";

const TOKEN_LOCALHOST = "bWJlZGRlZDo0MWRlOTZlYzkwYzZmMjhiY2Q1NWMyZjNhMDcwOTg1NjYxYzQ4ZjBm";
const EMPTY_TOKEN = "";

function emptyRequest(request: RequestUrlParam | string): RequestUrlResponsePromise {
  return {} as RequestUrlResponsePromise;
}

async function realFetchRequest(request: RequestUrlParam | string): RequestUrlResponsePromise {
  const url = typeof request === "string" ? request : request.url;
  const resp = await fetch(url, {
    method: typeof request === "string" ? "GET" : request.method,
    headers: typeof request === "string" ? undefined : request.headers,
    body: typeof request === "string" ? undefined : request.body
  });

  // Read the body once and cache it
  const arrayBuffer = await resp.arrayBuffer();
  const text = new TextDecoder().decode(arrayBuffer);
  let json = null;
  try {
    json = JSON.parse(text);
  } catch (ex) {
    // do nothing
  }

  const response = {
    status: resp.status,
    headers: Promise.resolve(Object.fromEntries(resp.headers)),
    arrayBuffer: arrayBuffer,
    json: Promise.resolve(json),
    text: Promise.resolve(text)
  } as unknown as RequestUrlResponsePromise;

  // Throw exception for non-2xx status codes
  if (!resp.ok) {
    const error = new Error(`HTTP ${resp.status}: ${resp.statusText}`) as any;
    error.status = resp.status;
    error.response = response;
    throw error;
  }

  return response;
}

function getInstance(token: string, doRequest: (request: RequestUrlParam | string) => RequestUrlResponsePromise) {
  return new TracksAdapter("http://localhost:8000", token, doRequest);
}

describe("With empty token", () => {
  test("Instance can be created", () => {
    const sut = getInstance(EMPTY_TOKEN, emptyRequest)

    expect(sut).toBeTruthy();
  });

  test("Ping should return unauthenticated", async () => {
    const sut = getInstance(EMPTY_TOKEN, realFetchRequest);

    const result = await sut.Ping();

    expect(result.isReachable).toBeTruthy();
    expect(result.isAuthenticated).toBeFalsy();
    expect(result.isOk()).toBeFalsy();
  })
})


test("Instance can be created", () => {

  const aa = 55;
})

// describe("Invalid token", () => {
//   test('Ping endpoint, should be invalid', async () => {
//     const sut = getInstance(EMPTY_TOKEN);
//
//     const result = await sut.Ping();
//
//     expect(result.isOk()).toBe(false);
//   });
// })
//
// test('Create instance with invalid token', () => {
//   const sut = getInvalidInstance()
//
//   expect(sut).toBeTruthy();
// });
//
// test('Create instance', () => {
//   const sut = getInstance();
//
//   expect(sut).toBeTruthy();
// });
//
// test('Ping endpoint, should be valid', async () => {
//   const sut = getInstance();
//
//   const result = await sut.Ping();
//
//   expect(result.isOk()).toBe(true);
// });
//
// test('Get contexts should return 2 items', async () => {
//   const sut = getInstance();
//
//   const result = await sut.GetContexts();
//
//   expect(result).toHaveLength(2);
// });
//
// test('Get todos should return 9 items', async () => {
//   const sut = getInstance();
//
//   const result = await sut.GetTodos();
//
//   expect(result).toHaveLength(9);
// });
