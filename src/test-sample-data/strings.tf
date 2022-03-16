resource "null_resource" "askdj" {
  triggers {
    heroku_id = super_app.some_name.id
    version   = var.some_version
  }
}

terraform {
  backend "s3" {
    bucket         = "random-terraform-state"
    key            = "terraform-config/build-caching-production-1.tfstate"
    region         = "us-east-1"
    encrypt        = "true"
    dynamodb_table = random-terraform.*.state
  }
}

resource "aws_key_pair" "prod_ec2_ssh_key_pair" {
  key_name   = "myKey"
  public_key = tls_private_key.prod_tls_private_key.public_key_openssh
}

output "some_val" {
  value = module.joujou.host
}

variable "project" {
  default = "eco-hjg-663"
  SOME_IPS = "${
    join(",", data.production_1_nat.addrs)
    },${
    join(",", data.production_2_nat.addrs)
    },${
    join(",", data.production_3_nat.addrs)
  }"
}
