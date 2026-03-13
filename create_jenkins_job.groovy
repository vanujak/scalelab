import jenkins.model.*
import org.jenkinsci.plugins.workflow.job.WorkflowJob
import org.jenkinsci.plugins.workflow.cps.CpsScmFlowDefinition
import hudson.plugins.git.GitSCM
import hudson.plugins.git.UserRemoteConfig
import hudson.plugins.git.BranchSpec

// Get Jenkins instance
def jenkins = Jenkins.get()

// Name of the pipeline job
def jobName = "ScaleLab-Deploy-Pipeline"

// The Git Repository URL where you will push your ScaleLab code.
// IMPORTANT: Replace this with your actual repository URL!
def gitRepoUrl = "https://github.com/your-username/ScaleLab.git"
def gitBranch = "*/main"

// Check if the job already exists
def job = jenkins.getItemByFullName(jobName)

if (job == null) {
    println "Creating new Pipeline job: ${jobName}"
    job = jenkins.createProject(WorkflowJob.class, jobName)
} else {
    println "Job ${jobName} already exists. Updating configuration."
}

// Configure the Git SCM source
def userRemoteConfig = new UserRemoteConfig(gitRepoUrl, null, null, null)
def branchSpec = new BranchSpec(gitBranch)

def scm = new GitSCM(
    [userRemoteConfig],
    [branchSpec],
    false,
    Collections.emptyList(),
    null,
    null,
    Collections.emptyList()
)

// Define the pipeline script to be loaded from the SCM (the Jenkinsfile we just created)
def flowDefinition = new CpsScmFlowDefinition(scm, "Jenkinsfile")

// Lightweight checkout reads the Jenkinsfile directly without doing a full checkout first (faster)
flowDefinition.setLightweight(true)

// Apply definition to job and save
job.setDefinition(flowDefinition)
job.save()

// Force a reload of the Jenkins configuration to ensure it appears cleanly in the UI
jenkins.reload()

println "Successfully configured job '${jobName}' pointing to ${gitRepoUrl}!"
