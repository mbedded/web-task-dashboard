import {test, expect} from "@jest/globals";
import {TracksAdapter} from "./TracksAdapter";

test('Create instance', () => {
  const sut = new TracksAdapter("", "");

  expect(sut).toBeTruthy();
});

function getInstance() {
  return new TracksAdapter("http://localhost:8000", "bWJlZGRlZDo0MWRlOTZlYzkwYzZmMjhiY2Q1NWMyZjNhMDcwOTg1NjYxYzQ4ZjBm");
}

test('Create instance', () => {
  const sut = getInstance();

  expect(sut).toBeTruthy();
});

test('Ping endpoint, should be valid', async () => {
  const sut = getInstance();

  const result = await sut.Ping();

  expect(result.isValid()).toBe(true);
});

test('Get contexts should return 2 items', async () => {
  const sut = getInstance();

  const result = await sut.GetContexts();

  expect(result).toHaveLength(2);
});

test('Get todos should return 9 items', async () => {
  const sut = getInstance();

  const result = await sut.GetTodos();

  expect(result).toHaveLength(9);
});
