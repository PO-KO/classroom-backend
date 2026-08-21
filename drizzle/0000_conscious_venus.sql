CREATE TABLE "subject" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "subject_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"name" varchar(255) NOT NULL,
	"department_id" integer NOT NULL,
	"code" varchar(30) NOT NULL,
	"description" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "subject_code_unique" UNIQUE("code")
);
--> statement-breakpoint
CREATE TABLE "department" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "department_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"code" varchar(30) NOT NULL,
	"name" varchar(255) NOT NULL,
	"description" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "department_code_unique" UNIQUE("code")
);
--> statement-breakpoint
ALTER TABLE "subject" ADD CONSTRAINT "subject_department_id_department_id_fk" FOREIGN KEY ("department_id") REFERENCES "public"."department"("id") ON DELETE restrict ON UPDATE no action;