CREATE TABLE `users` (
	`id` text(36) PRIMARY KEY NOT NULL,
	`email` text NOT NULL,
	`password` text,
	`name` text,
	`created_at` integer DEFAULT 0 NOT NULL,
	`updated_at` integer DEFAULT 0 NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `users_email_unique` ON `users` (`email`);--> statement-breakpoint
CREATE TABLE `sessions` (
	`id` text(36) PRIMARY KEY NOT NULL,
	`user_id` text NOT NULL,
	`active_token` text NOT NULL,
	`expires_at` integer NOT NULL,
	`created_at` integer DEFAULT 0 NOT NULL,
	`updated_at` integer DEFAULT 0 NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `oauth_accounts` (
	`id` text(36) PRIMARY KEY NOT NULL,
	`user_id` text NOT NULL,
	`provider` text NOT NULL,
	`provider_account_id` text NOT NULL,
	`provider_username` text,
	`created_at` integer DEFAULT 0 NOT NULL,
	`updated_at` integer DEFAULT 0 NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE UNIQUE INDEX `oauth_accounts_provider_provider_account_id_unique` ON `oauth_accounts` (`provider`,`provider_account_id`);--> statement-breakpoint
CREATE UNIQUE INDEX `oauth_accounts_user_id_provider_unique` ON `oauth_accounts` (`user_id`,`provider`);--> statement-breakpoint
CREATE TABLE `profiles` (
	`id` text(36) PRIMARY KEY NOT NULL,
	`user_id` text NOT NULL,
	`bio` text,
	`avatar_url` text,
	`location` text,
	`website` text,
	`theme` text DEFAULT 'light',
	`language` text DEFAULT 'en',
	`currency` text DEFAULT 'EUR',
	`created_at` integer DEFAULT 0 NOT NULL,
	`updated_at` integer DEFAULT 0 NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE cascade
);
