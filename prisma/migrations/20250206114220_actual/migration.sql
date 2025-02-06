-- CreateTable
CREATE TABLE "completed_tasks_history" (
    "id" SERIAL NOT NULL,
    "date_entry" DATE,
    "room_task_id" INTEGER,

    CONSTRAINT "completed_tasks_history_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "guests" (
    "id" SERIAL NOT NULL,
    "id_guest" VARCHAR(25),
    "first_name" VARCHAR(45),
    "first_lastname" VARCHAR(45),
    "middle_name" VARCHAR(45),
    "email" VARCHAR(45),
    "date_ofbirth" DATE,
    "phone_number" VARCHAR(20),
    "number_persons" INTEGER,
    "nationality" VARCHAR(40),
    "created_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "guests_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "invoice" (
    "id" SERIAL NOT NULL,
    "date_invoice" DATE,
    "total_amount" DOUBLE PRECISION,
    "status" VARCHAR(1),
    "reservation_id" INTEGER,
    "created_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,
    "mount_pending" DOUBLE PRECISION,

    CONSTRAINT "invoice_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "password_reset" (
    "id" SERIAL NOT NULL,
    "email" VARCHAR(255) NOT NULL,
    "reset_code" INTEGER NOT NULL,
    "expires_at" TIMESTAMP(6) NOT NULL,
    "used" BOOLEAN DEFAULT false,
    "created_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "password_reset_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "payment_detail" (
    "id" SERIAL NOT NULL,
    "notes" TEXT,
    "date_pay" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,
    "id_payment_method" INTEGER,
    "invoice_id" INTEGER,
    "mount" DOUBLE PRECISION,

    CONSTRAINT "payment_detail_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "payment_method" (
    "id" SERIAL NOT NULL,
    "method_name" VARCHAR(45),

    CONSTRAINT "payment_method_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "refresh_tokens" (
    "id" SERIAL NOT NULL,
    "refresh_token" TEXT,
    "user_id" INTEGER,
    "created_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "refresh_tokens_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "reservation" (
    "id" SERIAL NOT NULL,
    "date_reserve" DATE DEFAULT CURRENT_DATE,
    "date_checkin" DATE DEFAULT CURRENT_DATE,
    "date_checkout" DATE DEFAULT CURRENT_DATE,
    "number_nights" INTEGER,
    "guests_id_guest" VARCHAR(25),
    "created_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,
    "rooms" INTEGER[],

    CONSTRAINT "reservation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "reservation_rooms" (
    "id" SERIAL NOT NULL,
    "reservation_id" INTEGER,
    "room_id" INTEGER,

    CONSTRAINT "reservation_rooms_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "rol_staff" (
    "id" SERIAL NOT NULL,
    "rol_staffname" VARCHAR(45),

    CONSTRAINT "rol_staff_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "roles" (
    "id" SERIAL NOT NULL,
    "rol_name" VARCHAR(45),

    CONSTRAINT "roles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "room_equipment" (
    "id" SERIAL NOT NULL,
    "equipment_name" VARCHAR(45),

    CONSTRAINT "room_equipment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "room_specific_equipment" (
    "id" SERIAL NOT NULL,
    "room_id" INTEGER,
    "equipment_id" INTEGER,

    CONSTRAINT "room_specific_equipment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "room_task" (
    "id" SERIAL NOT NULL,
    "task_description" TEXT,
    "date_task" DATE,
    "staff_id" INTEGER,
    "room_id" INTEGER,

    CONSTRAINT "room_task_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "room_type" (
    "id" SERIAL NOT NULL,
    "type" VARCHAR(45),
    "capacity" INTEGER,
    "price" DOUBLE PRECISION,
    "type_bed" VARCHAR(20),
    "size" DOUBLE PRECISION,
    "hotel_floor" VARCHAR(2),

    CONSTRAINT "room_type_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "rooms" (
    "id" SERIAL NOT NULL,
    "status" VARCHAR(1),
    "room_type_id" INTEGER,

    CONSTRAINT "rooms_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "staff" (
    "id" SERIAL NOT NULL,
    "id_staff" VARCHAR(12),
    "name_staff" VARCHAR(45),
    "lastname_staff" VARCHAR(45),
    "email_staff" VARCHAR(45),
    "phone" VARCHAR(20),
    "rol_id" INTEGER,
    "created_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,
    "gen" VARCHAR(1),

    CONSTRAINT "staff_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "staff_schedule" (
    "id" SERIAL NOT NULL,
    "staff_id" INTEGER,
    "days_week" TEXT,
    "start_time" TIME(6),
    "end_time" TIME(6),
    "shift_type" VARCHAR(20),
    "notes" TEXT,

    CONSTRAINT "staff_schedule_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "users" (
    "id" SERIAL NOT NULL,
    "password" VARCHAR(100),
    "role_id" INTEGER,
    "staff_id" VARCHAR(12),
    "created_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "guests_id_guest_key" ON "guests"("id_guest");

-- CreateIndex
CREATE INDEX "idx_password_reset_email" ON "password_reset"("email");

-- CreateIndex
CREATE UNIQUE INDEX "staff_id_staff_key" ON "staff"("id_staff");

-- AddForeignKey
ALTER TABLE "completed_tasks_history" ADD CONSTRAINT "completed_tasks_history_room_task_id_fkey" FOREIGN KEY ("room_task_id") REFERENCES "room_task"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "invoice" ADD CONSTRAINT "invoice_reservation_id_fkey" FOREIGN KEY ("reservation_id") REFERENCES "reservation"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "payment_detail" ADD CONSTRAINT "payment_detail_id_payment_method_fkey" FOREIGN KEY ("id_payment_method") REFERENCES "payment_method"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "reservation" ADD CONSTRAINT "guests_id_guest_fkey" FOREIGN KEY ("guests_id_guest") REFERENCES "guests"("id_guest") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "reservation_rooms" ADD CONSTRAINT "reservation_rooms_reservation_id_fkey" FOREIGN KEY ("reservation_id") REFERENCES "reservation"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "reservation_rooms" ADD CONSTRAINT "reservation_rooms_room_id_fkey" FOREIGN KEY ("room_id") REFERENCES "rooms"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "room_specific_equipment" ADD CONSTRAINT "room_specific_equipment_equipment_id_fkey" FOREIGN KEY ("equipment_id") REFERENCES "room_equipment"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "room_specific_equipment" ADD CONSTRAINT "room_specific_equipment_room_id_fkey" FOREIGN KEY ("room_id") REFERENCES "rooms"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "room_task" ADD CONSTRAINT "room_task_room_id_fkey" FOREIGN KEY ("room_id") REFERENCES "rooms"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "rooms" ADD CONSTRAINT "rooms_room_type_id_fkey" FOREIGN KEY ("room_type_id") REFERENCES "room_type"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "staff" ADD CONSTRAINT "staff_rol_id_fkey" FOREIGN KEY ("rol_id") REFERENCES "rol_staff"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "users" ADD CONSTRAINT "users_role_id_fkey" FOREIGN KEY ("role_id") REFERENCES "roles"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "users" ADD CONSTRAINT "users_staff_id_fkey" FOREIGN KEY ("staff_id") REFERENCES "staff"("id_staff") ON DELETE CASCADE ON UPDATE CASCADE;
