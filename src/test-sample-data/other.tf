variable "github_users" {}


resource "aws_key_pair" "prod_ec2_ssh_key_pair" {
  num  = 5
  bool = true

  provisioner "local-exec" {
    command = "echo '${tls_private_key.prod_tls_private_key.private_key_pem}' > ./myKey.pem"
  }
  provisioner "local-exec" {
    command = "chmod 400 ./myKey.pem"
  }
  provisioner "local-exec" {
    command = "echo 'aaa'"
  }
  provisioner "local-exec" {
    deep {
      nested {
        property {
          equals = "this"
        }
      }
    }
  }
}
