# GhostHand Architecture

This document describes the high-level architecture of GhostHand.

## Core flow

User command -> OpenClaw agent -> command planning -> wireless ADB bridge -> Android action -> result verification

## Main layers

1. User command layer
2. Agent runtime layer
3. Local execution layer (Termux)
4. Android control bridge (wireless ADB)
5. Verification and feedback layer

## Goal

The goal of GhostHand is to enable same-device AI control on Android using natural language and local execution.
