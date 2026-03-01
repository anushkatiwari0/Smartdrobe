# SmartDrobe Decision Log

This document records the significant architectural and UX decisions made during the development of SmartDrobe.

---

## Decision 1: Explicit vs. Implicit User Feedback
*   **The Problem:** To build personalized AI styling models, the system needs to know if a user actually liked a suggested outfit.
*   **The Decision:** We implemented large, explicit binary feedback buttons ("Wear It" and "Skip It") directly beneath the outfit combinations, bypassing implicit signals (like "time spent looking at an outfit").
*   **The Reasoning:** For Reinforcement Learning from Human Feedback (RLHF), we need clean, deterministic data. Implicit signals are too noisy in fashion. Forcing an explicit choice guarantees accurate tracking for our North Star Metric (Outfit Acceptance Rate).

## Decision 2: Local Storage vs. Relational Database MVP
*   **The Problem:** Storing heavy images and JSON relationship data usually requires a PostgreSQL database.
*   **The Decision:** We built V1 maintaining state entirely in `localStorage` via Zustand (`use-closet-store.tsx`) without a backend.
*   **The Reasoning:** Speed to market and reducing time-to-value for the user. We bypassed the friction of user authentication entirely. The goal of the MVP is to test the AI recommendation logic; setting up infrastructure would delay validation.
*   **Trade-offs:** We accepted the risk of state loss and device-isolation in exchange for instant prototyping.

## Decision 3: "Consumer Friendly" Explainable AI vs. PM Dashboards
*   **The Problem:** Early iterations included heavy PM-style reasoning blocks (explaining confidence scores, technical logic, and exact prompt matches) which overwhelmed consumer users.
*   **The Decision:** We completely stripped away technical dashboards from the UI, translating the AI reasoning into a simple bulleted list (e.g., "Suggested because: • Matches the sunny weather").
*   **The Reasoning:** A real startup product must feel like magic to the user, not a spreadsheet. Transparency builds trust, but only if it's written in human-readable language. All complex PM metrics and strategy documents were moved to a strictly separated `/docs` folder.

## Decision 4: Using Google Genkit for LLM Orchestration
*   **The Problem:** Generating structured JSON output for outfit combinations via raw OpenAI/Anthropic APIs is prone to hallucinated keys or syntax errors, breaking the UI.
*   **The Decision:** We integrated Firebase Genkit to enforce Zod-schema validation on all LLM outputs.
*   **The Reasoning:** Genkit guarantees that the `QuickOutfitGenerator` will only return the exact object shape required by our React components, entirely eliminating JSON-parsing runtime crashes.
