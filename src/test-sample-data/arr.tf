resource "aws_security_group" "prod_sg" {
  ingress {
    cidr_blocks = ["0.0.0.0/0"]
    stuff = ["asdf", "asdf", "asdf", "asdf", "asdf", "asdf",
      "fff", "bbb",
    "asdf", "asdf", "asdf", "asdf"]
    otherStuff = []
    moreStuff = [
      "text",
      "moreText",
    ]
    records = [
      "${data.dns_a_record_set.gce_production_1_nat.addrs}",
      "${data.dns_a_record_set.gce_production_2_nat.addrs}",
      "${data.dns_a_record_set.gce_production_3_nat.addrs}",
    ]
    records2 = ["${
      distinct(
        concat(
          data.dns_a_record_set.gce_production_1_build_cache.addrs,
          data.dns_a_record_set.gce_production_2_build_cache.addrs
        )
      )
    }"]
  }
}
