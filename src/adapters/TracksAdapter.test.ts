import { test, expect, describe } from "@jest/globals";
import { TracksAdapter } from "./TracksAdapter";
import type { RequestUrlParam, RequestUrlResponse, RequestUrlResponsePromise } from "obsidian";

const TOKEN_LOCALHOST = btoa("mbedded:79907a25379561f41dbbfb87f388e3519ce9daf8"); // "bWJlZGRlZDo0MWRlOTZlYzkwYzZmMjhiY2Q1NWMyZjNhMDcwOTg1NjYxYzQ4ZjBm";
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
    json: json,
    text: text
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
  return new TracksAdapter("http://localhost:9000", token, doRequest);
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

describe("With valid token", () => {
  test("Instance can be created", () => {
    const sut = getInstance(TOKEN_LOCALHOST, realFetchRequest);

    expect(sut).toBeTruthy();
  })

  test("Ping should return authenticated", async () => {
    const sut = getInstance(TOKEN_LOCALHOST, realFetchRequest);

    const result = await sut.Ping();

    expect(result.isReachable).toBeTruthy();
    expect(result.isAuthenticated).toBeTruthy();
    expect(result.isOk()).toBeTruthy();
  })

  test('Get contexts should return 2 items', async () => {
    const sut = getInstance(TOKEN_LOCALHOST, realFetchRequest);

    const result = await sut.GetActiveContexts();

    expect(result).toHaveLength(3);
  });

  test('Get todos should return 9 items', async () => {
    const sut = getInstance(TOKEN_LOCALHOST, realFetchRequest);

    const result = await sut.GetActiveTodos(1);

    expect(result).toHaveLength(2);
  });
})


