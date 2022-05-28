# Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
resource "aws_key_pair" "prod_ec2_ssh_key_pair" {
  provisioner "local-exec" {
    command = "echo '${tls_private_key.prod_tls_private_key.private_key_pem}' > ./myKey.pem"
  }
  provisioner "local-exec" {
    command = "chmod 400 ./myKey.pem"
  }
  provisioner "local-exec" {
    command = "echo 'aaa'"
  }
}

// Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
output "some_val" {
  value = module.joujou.host
}

/*
Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.
Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
*/
variable "project" {
  default = "eco-hjg-663"
}
