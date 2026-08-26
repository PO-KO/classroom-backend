ALTER TABLE "class" DROP CONSTRAINT "class_subject_id_subject_id_fk";
--> statement-breakpoint
ALTER TABLE "account" ADD COLUMN "issuer" text;--> statement-breakpoint
ALTER TABLE "class" ADD CONSTRAINT "class_subject_id_subject_id_fk" FOREIGN KEY ("subject_id") REFERENCES "public"."subject"("id") ON DELETE restrict ON UPDATE no action;