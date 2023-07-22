import Constants from "expo-constants";
import Replicate from "replicate";

import { REPLICATE_API_TOKEN } from "~/config/consts";

export const replicate = new Replicate({
  auth:
    (Constants.expoConfig?.extra?.replicateToken as string | undefined) ??
    REPLICATE_API_TOKEN,
});
