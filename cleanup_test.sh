# Close any open PRs for test-ec2-upgrade branch
gh pr list --head test-ec2-upgrade --repo odrori1997/aws-cdk-project-template-for-devops --json number --jq '.[].number' | while read pr_number; do
  if [ ! -z "$pr_number" ]; then
    echo "Closing PR #$pr_number"
    gh pr close "$pr_number" --repo odrori1997/aws-cdk-project-template-for-devops
  fi
done

git checkout main
git branch -D test-ec2-upgrade
git push origin --delete test-ec2-upgrade
git reset HEAD~1
