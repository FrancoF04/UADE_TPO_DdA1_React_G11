# Expo HAS CHANGED

Read the exact versioned docs at https://docs.expo.dev/versions/v54.0.0/ before writing any code.

# docs/

The `docs/` folder contains technical reference documentation for this project.
Read the relevant files there before writing any code that touches the backend API, network communication, robot behavior, or course requirements.

## Active docs — read these when building features

- `docs/BACKEND_API_REFERENCE.md` — The backend API this app communicates with. Read before implementing any network call or data model.
- `docs/BACKEND_GITHUB_REPO.txt` — Link and context for the backend GitHub repository. Use it to investigate endpoints or behavior not covered in the API reference.
- `docs/RN_CLASSES_CONTEXT.md` — Course requirements: which React Native classes and patterns the subject demands. Read before making architectural decisions.

## Legacy reference — do NOT use these to implement features

The following files document the low-level Unitree robot HTTP/WebSocket APIs. They are kept as historical context only. The app communicates with the backend described above, not directly with the robots.

- `docs/UNITREE_GO2_API_REFERENCE.md` — HTTP/WebSocket API for the Unitree Go2 quadruped robot (SportClient, api_id 1xxx/2xxx).
- `docs/UNITREE_G1_API_REFERENCE.md` — HTTP/WebSocket API for the Unitree G1 humanoid robot (LocoClient, G1ArmActionClient, AudioClient, api_id 7xxx).
