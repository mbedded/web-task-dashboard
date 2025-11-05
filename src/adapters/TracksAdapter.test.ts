import { test, expect, describe } from "@jest/globals";
import { TracksAdapter } from "./TracksAdapter";
import type { RequestUrlParam, RequestUrlResponsePromise } from "obsidian";
import { emptyRequest, realFetchRequest } from "./AdapterHelper.test";

const TOKEN_LOCALHOST = "bWJlZGRlZDo0MWRlOTZlYzkwYzZmMjhiY2Q1NWMyZjNhMDcwOTg1NjYxYzQ4ZjBm";
const EMPTY_TOKEN = "";


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


describe("With valid token", () => {

  test("Instance can be created", () => {
    const sut = getInstance(TOKEN_LOCALHOST, emptyRequest)

    expect(sut).toBeTruthy();
  });

  test("Ping should be fine", async () => {
    const sut = getInstance(TOKEN_LOCALHOST, realFetchRequest);

    const result = await sut.Ping();

    expect(result.isOk()).toBeTruthy();
  })

  test('Get contexts should return 2 items', async () => {
    const sut = getInstance(TOKEN_LOCALHOST, realFetchRequest);

    const result = await sut.GetContexts();

    expect(result).toHaveLength(2);
  });

  test('Get todos should return 9 items', async () => {
    const sut = getInstance(TOKEN_LOCALHOST, realFetchRequest);

    const result = await sut.GetTodos();

    expect(result).toHaveLength(9);
  });
})

