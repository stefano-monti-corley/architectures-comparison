
# --------- IMAGE UPLOAD ---------

docker build -t test-aurora .
docker tag test-aurora 327465495978.dkr.ecr.eu-central-1.amazonaws.com/test-aurora:v1
aws ecr get-login-password --region eu-central-1 --profile lab01 | docker login --username AWS --password-stdin 327465495978.dkr.ecr.eu-central-1.amazonaws.com 
docker push 327465495978.dkr.ecr.eu-central-1.amazonaws.com/test-aurora:v1


# forcing new ecs deployment with the updated images
aws ecs update-service --cluster stw-aws-ecs-microservices --service test-service-service --force-new-deployment