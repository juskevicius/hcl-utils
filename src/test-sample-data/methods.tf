resource "null_resource" "askdj" {
  triggers {
    some_stuff       = slice(var.ss, 0)
    config_signature = sha256(join(",", values(jjjjj.asdjhf.ll_jjj.0)))
    scale            = join(",", var.some_var)
  }
}

variable "project" {
  config_signature = sha256(join(",", values(super_app.my_vars.0)))
}
