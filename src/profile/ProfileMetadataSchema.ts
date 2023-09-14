import { z } from 'zod';

import { ProfileSchemaId } from './ProfileSchemaId.js';
import { MetadataAttributeSchema } from '../MetadataAttribute.js';
import {
  AppIdSchema,
  SignatureSchema,
  markdownSchema,
  nonEmptyStringSchema,
  uriSchema,
} from '../primitives.js';

/**
 * @internal
 */
export const ProfileMetadataDetailsSchema = z.object(
  {
    id: nonEmptyStringSchema(
      'A unique identifier that in storages like IPFS ensures the uniqueness of the metadata URI. Use a UUID if unsure.',
    ),

    name: nonEmptyStringSchema('The profile display name.').optional(),

    bio: markdownSchema('The profile bio as markdown.').optional(),

    picture: uriSchema('The profile picture.').optional(),

    coverPicture: uriSchema('The profile cover picture.').optional(),

    attributes: MetadataAttributeSchema.array()
      .min(1)
      .optional()
      .describe(
        'An optional bag of attributes that can be used to store any kind of metadata that is not currently supported by the standard. ' +
          'Over time, common attributes will be added to the standard and their usage as arbitrary attributes will be discouraged.',
      ),

    appId: AppIdSchema.optional().describe(
      'The App Id that this Profile data refers to. ' +
        'If omitted the data is considered to be the global Profile data.',
    ),
  },
  { description: 'The Lens specific metadata details.' },
);
export type ProfileMetadataDetails = z.infer<typeof ProfileMetadataDetailsSchema>;

/**
 * Profile Metadata schema.
 *
 * @example
 * with `parse`:
 * ```typescript
 * ProfileMetadataSchema.parse(valid); // => ProfileMetadata
 *
 * ProfileMetadataSchema.parse(invalid); // => throws ZodError
 * ```
 *
 * @example
 * with `safeParse`:
 * ```typescript
 * ProfileMetadataSchema.safeParse(valid);
 * // => { success: true, data: ProfileMetadata }
 *
 * ProfileMetadataSchema.safeParse(invalid);
 * // => { success: false, error: ZodError }
 * ```
 */
export const ProfileMetadataSchema = z.object({
  $schema: z.literal(ProfileSchemaId.LATEST),

  lens: ProfileMetadataDetailsSchema,

  signature: SignatureSchema.optional(),
});
export type ProfileMetadata = z.infer<typeof ProfileMetadataSchema>;
