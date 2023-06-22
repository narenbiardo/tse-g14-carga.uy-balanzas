data "google_service_account" "terraform-access" {
  account_id = "101107295625398497406"
}

resource "google_compute_instance" "default" {
  name         = "balanzas"
  machine_type = "n2-standard-2"
  zone         = "us-central1-a"

  boot_disk {
    initialize_params {
      image = "debian-10"
    }
  }

  network_interface {
    network = "default"

    access_config {

    }
  }

  metadata_startup_script =  file("startup-script.sh")

  tags = ["http-server","https-server"]

  service_account {
    email = "terraform-access@balanzas-390118.iam.gserviceaccount.com"
    scopes = ["cloud-platform"]
  }
}

resource "google_compute_firewall" "nodejs-server" {
  name    = "allow-nodejs"
  network = "default"

  allow {
    protocol = "tcp"
    ports    = ["443"]
  }

  source_ranges = ["0.0.0.0/0"]
  target_tags   = ["http-server","https-server"]
}

output "ip" {
  value = google_compute_instance.default.network_interface[0].access_config[0].nat_ip
}

resource "google_dns_managed_zone" "balanzas-dns" {
  name     = "balanzas"
  dns_name = "balanzas-tse-g14-2023.com."
}

resource "google_dns_record_set" "balanzas-dns-record-set" {
  managed_zone = google_dns_managed_zone.balanzas-dns.name

  name    = google_dns_managed_zone.balanzas-dns.dns_name
  type    = "A"
  rrdatas = [google_compute_instance.default.network_interface[0].access_config[0].nat_ip]
  ttl     = 300
}
