CREATE TABLE "devices" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "api_key_hash" TEXT NOT NULL,
    "location_label" TEXT,
    "enabled" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "last_seen_at" TIMESTAMP(3),

    CONSTRAINT "devices_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "speedtest_results" (
    "id" TEXT NOT NULL,
    "device_id" TEXT NOT NULL,
    "measured_at" TIMESTAMP(3) NOT NULL,
    "ping_ms" DOUBLE PRECISION NOT NULL,
    "jitter_ms" DOUBLE PRECISION NOT NULL,
    "download_mbps" DOUBLE PRECISION NOT NULL,
    "upload_mbps" DOUBLE PRECISION NOT NULL,
    "packet_loss" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "isp" TEXT,
    "external_ip" TEXT,
    "server_id" TEXT,
    "server_name" TEXT,
    "server_location" TEXT,
    "server_country" TEXT,
    "result_url" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "speedtest_results_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "devices_api_key_hash_key" ON "devices"("api_key_hash");
CREATE INDEX "devices_enabled_idx" ON "devices"("enabled");
CREATE UNIQUE INDEX "speedtest_results_device_id_measured_at_key" ON "speedtest_results"("device_id", "measured_at");
CREATE INDEX "speedtest_results_device_id_measured_at_idx" ON "speedtest_results"("device_id", "measured_at" DESC);
CREATE INDEX "speedtest_results_measured_at_idx" ON "speedtest_results"("measured_at" DESC);

ALTER TABLE "speedtest_results"
ADD CONSTRAINT "speedtest_results_device_id_fkey"
FOREIGN KEY ("device_id") REFERENCES "devices"("id")
ON DELETE CASCADE
ON UPDATE CASCADE;
