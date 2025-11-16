git add .
git commit -m "test: ec2 upgrade"
git checkout -b test-ec2-upgrade
git push origin test-ec2-upgrade
gh pr create --title "test: ec2 upgrade" --body "test: ec2 upgrade" --base odrori1997/aws-cdk-project-template-for-devops/main --head test-ec2-upgrade