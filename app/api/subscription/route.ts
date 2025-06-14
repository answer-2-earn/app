import { createFailedApiResponse, createSuccessApiResponse } from "@/lib/api";
import { errorToString } from "@/lib/converters";
import { insertSubscription } from "@/mongodb/services/subscription-service";
import { NextRequest } from "next/server";
import { z } from "zod";

const requestBodySchema = z.object({
  answererAddress: z.string().length(42),
  subscriberAddress: z.string().length(42),
  subscriberEmail: z.string().email(),
});

export async function POST(request: NextRequest) {
  try {
    // Get and parse request data
    const body = await request.json();
    const bodyParseResult = requestBodySchema.safeParse(body);
    if (!bodyParseResult.success) {
      return createFailedApiResponse(
        {
          message: `Request body invalid: ${JSON.stringify(bodyParseResult)}`,
        },
        400
      );
    }

    // Save subscription in the database
    await insertSubscription({ created: new Date(), ...bodyParseResult.data });

    // Return success response
    return createSuccessApiResponse("Success");
  } catch (error) {
    console.error(
      `Failed to process ${request.method} request for "${
        new URL(request.url).pathname
      }":`,
      errorToString(error)
    );
    return createFailedApiResponse(
      { message: "Internal server error, try again later" },
      500
    );
  }
}
