# Building Android APKs on Termux

This document collects the practical setup steps needed to build Android APKs directly on-device using Termux.

## Current known points

- Use Android SDK 34 for better compatibility
- Keep projects under ~/ instead of shared storage
- Use Termux-installed aapt2 via Gradle override
- Keep wireless ADB available for install/test loops

## Purpose

To document a repeatable and reliable Android build workflow inside Termux.
