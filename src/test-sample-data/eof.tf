resource "null_resource" "askdj" {
  provisioner "local-exec" {
    command = <<EOF
exec ${path.module}/../bin/heroku-stop-me \
  --repo=travis-ci/whereami \
  --app=${heroku_app.whereami.id} \
  --ps-scale=${join(",", var.whereami_scale)} \
  --deploy-version=${var.whereami_version}
EOF
  }

  website {
    index_document = "index.html"
    error_document = "error.html"

    routing_rules = <<EOF
[{
    "Condition": {
        "KeyPrefixEquals": "docs/"
    },
    "Redirect": {
        "ReplaceKeyPrefixWith": "documents/"
    }
}]
EOF
  }
}
