sudo apt update
sudo apt install docker.io -y 
sudo apt install docker-compose -y

# let $USER use docker without sudo
sudo gpasswd -a $USER docker

# install microsoft signing key
curl -sL https://packages.microsoft.com/keys/microsoft.asc | gpg --dearmor | sudo tee /etc/apt/trusted.gpg.d/microsoft.asc.gpg > /dev/null

# add azure cli software repo
AZ_REPO=$(lsb_release -cs)
echo "deb [arch=amd64] https://packages.microsoft.com/repos/azure-cli/ $AZ_REPO main" | sudo tee /etc/apt/sources.list.d/azure-cli.list

# install azure cli
sudo apt-get update
sudo apt-get install azure-cli

echo Installing vsts-agent
mkdir ~/vsts-agent
cd ~/vsts-agent
curl -fkSL -o vstsagent.tar.gz https://vstsagentpackage.azureedge.net/agent/2.149.2/vsts-agent-linux-x64-2.149.2.tar.gz
tar -zxvf vstsagent.tar.gz

echo Configuring vsts-agent as ${USER}
./config.sh --unattended --deploymentgroup --deploymentgroupname "default" --addDeploymentGroupTags --replace --deploymentGroupTags signalr --acceptteeeula --agent $HOSTNAME --url https://dev.azure.com/staffordwilliams/ --work _work --projectname 'digitalicebreakers' --auth PAT --token ohobqpoqnkq23vgot7otqiyygqyubevh6lwpcvnymfw27cshb6ia --runasservice

# remove existing vsts-agent
if [ -e /etc/systemd/system/vsts.agent.staffordwilliams.digital-icebreakers-vm.service ]; 
then
    sudo rm -rf /etc/systemd/system/vsts.agent.staffordwilliams.digital-icebreakers-vm.service
fi

# start agent
echo Starting vsts-agent
sudo ./svc.sh install;
sudo ./svc.sh start; 

# acr login
az login --identity
sudo az acr login --name stafford
