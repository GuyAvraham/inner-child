import type { AxiosInstance } from "axios";
import axios from "axios";

import { sleep } from "@innch/utils";

import { REPLICATE_API_TOKEN } from "~/config/consts";

interface Prediction {
  uuid: string;
  version_id: string;
  status: "succeeded" | "canceled" | "failed" | "queued" | "processing";
  error: null | string;
  output: null | string;
}

class Replicate {
  auth: string;
  private baseUrl: string;
  private interval: number;
  private maxAttempts: number;
  private fetch: AxiosInstance;

  constructor(options: {
    auth: string;
    wait?: { interval?: number; maxAttempts?: number };
  }) {
    if (!options.auth) {
      throw new Error("Missing required parameter: auth");
    }

    this.auth = options.auth;
    this.baseUrl = "https://api.replicate.com/v1/predictions";
    this.fetch = axios.create({
      headers: {
        Authorization: `Token ${this.auth}`,
        "Content-Type": "application/json",
      },
    });
    this.interval = options.wait?.interval ?? 250;
    this.maxAttempts = options.wait?.maxAttempts ?? Infinity;
  }

  async generateSAMImage({ age, image }: { image: string; age: number }) {
    try {
      const apiResponse = await this.fetch.post(this.baseUrl, {
        version:
          "9222a21c181b707209ef12b5e0d7e94c994b58f01c7b2fec075d2e892362f13c",
        input: {
          image,
          target_age: age,
        },
      });

      console.log(apiResponse);
    } catch (error) {
      console.log(JSON.stringify(error, null, 2));
    }
    // return this.wait(prediction.data);
  }

  async getPrediction(prediction_id: string) {
    return (
      await this.fetch.get<Prediction>(`${this.baseUrl}/${prediction_id}`)
    ).data;
  }

  private async wait(prediction: Prediction) {
    console.log(JSON.stringify(prediction, null, 2));
    if (!prediction.uuid) {
      throw new Error("Invalid prediction");
    }

    if (
      prediction.status === "succeeded" ||
      prediction.status === "failed" ||
      prediction.status === "canceled"
    ) {
      return prediction;
    }

    let updatedPrediction = await this.getPrediction(prediction.uuid);

    let attempts = 0;

    while (
      updatedPrediction.status !== "succeeded" &&
      updatedPrediction.status !== "failed" &&
      updatedPrediction.status !== "canceled"
    ) {
      attempts += 1;

      if (this.maxAttempts && attempts > this.maxAttempts) {
        throw new Error(
          `Prediction ${prediction.uuid} did not finish after ${this.maxAttempts} attempts`,
        );
      }

      await sleep(this.interval);

      updatedPrediction = await this.getPrediction(prediction.uuid);
    }

    if (updatedPrediction.status === "failed") {
      throw new Error(`Prediction failed: ${updatedPrediction.error}`);
    }

    return updatedPrediction;
  }
}

export default Replicate;

export const replicate = new Replicate({ auth: REPLICATE_API_TOKEN });
