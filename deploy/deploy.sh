## this script runs as root

echo user is $USER

apt update
apt install docker.io -y 
apt install docker-compose -y

# let $USER use docker without sudo
gpasswd -a stafford docker

# install microsoft signing key
curl -sL https://packages.microsoft.com/keys/microsoft.asc | gpg --dearmor | tee /etc/apt/trusted.gpg.d/microsoft.asc.gpg > /dev/null

# add azure cli software repo
AZ_REPO=$(lsb_release -cs)
echo "deb [arch=amd64] https://packages.microsoft.com/repos/azure-cli/ $AZ_REPO main" | tee /etc/apt/sources.list.d/azure-cli.list

# install azure cli
apt-get update
apt-get install azure-cli

echo user is $USER

echo switching to user stafford
-s -u stafford

echo user is $USER

# Installing vsts-agent
mkdir /home/stafford/vsts-agent
cd /home/stafford/vsts-agent
curl -fkSL -o vstsagent.tar.gz https://vstsagentpackage.azureedge.net/agent/2.150.0/vsts-agent-linux-x64-2.150.0.tar.gz
tar --overwrite -zxvf vstsagent.tar.gz

echo install vsts-agent dependencies
./bin/installdependencies.sh

echo Configuring vsts-agent as $USER
chown stafford -R ./
sudo -u stafford ./config.sh --unattended --deploymentgroup --deploymentgroupname "default" --addDeploymentGroupTags --replace --deploymentGroupTags signalr --acceptteeeula --agent $HOSTNAME --url https://dev.azure.com/staffordwilliams/ --work _work --projectname 'digitalicebreakers' --auth PAT --token ohobqpoqnkq23vgot7otqiyygqyubevh6lwpcvnymfw27cshb6ia --runasservice

# remove existing vsts-agent
if [ -e /etc/systemd/system/vsts.agent.staffordwilliams.digital-icebreakers-vm.service ]; 
then
    rm -rf /etc/systemd/system/vsts.agent.staffordwilliams.digital-icebreakers-vm.service
fi

# start agent
echo Starting vsts-agent
./svc.sh install;
./svc.sh start; 
