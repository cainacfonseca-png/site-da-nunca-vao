CREATE TABLE `page_visits` (
	`id` int AUTO_INCREMENT NOT NULL,
	`path` varchar(200) NOT NULL DEFAULT '/',
	`referrer` varchar(500),
	`userAgent` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `page_visits_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `product_clicks` (
	`id` int AUTO_INCREMENT NOT NULL,
	`productId` int NOT NULL,
	`referrer` varchar(500),
	`userAgent` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `product_clicks_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `products` (
	`id` int AUTO_INCREMENT NOT NULL,
	`name` varchar(220) NOT NULL,
	`section` enum('store','finds') NOT NULL,
	`description` text,
	`imageUrl` text,
	`videoUrl` text,
	`purchaseUrl` text NOT NULL,
	`position` int NOT NULL DEFAULT 0,
	`active` boolean NOT NULL DEFAULT true,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `products_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `users` (
	`id` int AUTO_INCREMENT NOT NULL,
	`openId` varchar(64) NOT NULL,
	`name` text,
	`email` varchar(320),
	`loginMethod` varchar(64),
	`role` enum('user','admin') NOT NULL DEFAULT 'user',
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	`lastSignedIn` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `users_id` PRIMARY KEY(`id`),
	CONSTRAINT `users_openId_unique` UNIQUE(`openId`)
);
--> statement-breakpoint
CREATE INDEX `product_clicks_product_created_idx` ON `product_clicks` (`productId`,`createdAt`);--> statement-breakpoint
CREATE INDEX `products_section_position_idx` ON `products` (`section`,`position`);