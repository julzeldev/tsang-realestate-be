import { SetMetadata } from '@nestjs/common';

// Define a constant key that will be used to store metadata
export const IS_PUBLIC_KEY = 'isPublic';

// Create the Public decorator
export const Public = () => SetMetadata(IS_PUBLIC_KEY, true);
