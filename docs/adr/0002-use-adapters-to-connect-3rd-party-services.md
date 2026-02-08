# 2. Use adapters to connect 3rd party services

Date: 2026-01-06

## Status

Accepted

## Context

This plugin serves as a frontend for displaying data (todos and tasks) from third-party services.
While writing this, only "Tracks" is supported.
However, the plugin is intended to be extensible to support various backends.
The Adapter pattern is an effective way to encapsulate service-specific logic and provide a unified interface to the application.

## Decision

We will implement an Adapter layer to connect to third-party services.
All adapters will implement a common interface defining standard operations, such as "create todo" or "mark todo as done."

## Consequences

We need to implement a separate adapter for each service we want to support.
This will allow us to easily switch between services without changing the plugin's code.
Based on the supported features in the backend, we may need additional functions like `is XY supported`.
Depending on the features, the plugin or frontend must be updated to reflect the feature set.
