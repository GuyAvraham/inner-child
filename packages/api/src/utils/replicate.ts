import Replicate from "replicate";

export const replicate = new Replicate({
  auth:
    process.env.REPLICATE_API_TOKEN ||
    "r8_8iJJNgmej00bJK9QAN0hmtJXuuXR8Jz2wZWcM",
});
