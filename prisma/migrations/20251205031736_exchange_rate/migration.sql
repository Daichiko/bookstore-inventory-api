-- CreateTable
CREATE TABLE "exchange_rate_batches" (
    "id" SERIAL NOT NULL,
    "time_last_update_unix" BIGINT NOT NULL,
    "time_last_update_utc" TIMESTAMP(3) NOT NULL,
    "time_next_update_unix" BIGINT NOT NULL,
    "time_next_update_utc" TIMESTAMP(3) NOT NULL,
    "base_code" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "exchange_rate_batches_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "conversion_rates" (
    "id" SERIAL NOT NULL,
    "batch_id" INTEGER NOT NULL,
    "target_code" TEXT NOT NULL,
    "rate" DECIMAL(65,30) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "conversion_rates_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "conversion_rates_batch_id_target_code_key" ON "conversion_rates"("batch_id", "target_code");

-- AddForeignKey
ALTER TABLE "conversion_rates" ADD CONSTRAINT "conversion_rates_batch_id_fkey" FOREIGN KEY ("batch_id") REFERENCES "exchange_rate_batches"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
