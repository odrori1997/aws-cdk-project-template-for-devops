git add .
git commit -m "test: ec2 upgrade"
git checkout -b test-ec2-upgrade
git push origin test-ec2-upgrade

# Create PR from test-ec2-upgrade to main
gh pr create \
  --base main \
  --head test-ec2-upgrade \
  --repo odrori1997/aws-cdk-project-template-for-devops \
  --title "test: ec2 upgrade" \
  --body "Test PR for EC2 upgrade changes"