import jenkins.model.Jenkins
import com.cloudbees.plugins.credentials.CredentialsScope
import com.cloudbees.plugins.credentials.SystemCredentialsProvider
import com.cloudbees.plugins.credentials.domains.Domain
import hudson.util.Secret
import org.jenkinsci.plugins.plaincredentials.impl.StringCredentialsImpl

// Update these values before running in Jenkins Script Console.
def credentialId = 'scalelab-google-client-id'
def credentialDescription = 'ScaleLab Google OAuth Web Client ID'
def googleClientIdValue = 'REPLACE_WITH_GOOGLE_CLIENT_ID.apps.googleusercontent.com'

if (!googleClientIdValue || googleClientIdValue.contains('REPLACE_WITH_GOOGLE_CLIENT_ID')) {
    throw new IllegalArgumentException('Set googleClientIdValue before running this script.')
}

def jenkins = Jenkins.get()
def store = SystemCredentialsProvider.getInstance().getStore()
def domain = Domain.global()

def existing = com.cloudbees.plugins.credentials.CredentialsProvider.lookupCredentials(
    org.jenkinsci.plugins.plaincredentials.StringCredentials.class,
    jenkins
).find { it.id == credentialId }

def newCredential = new StringCredentialsImpl(
    CredentialsScope.GLOBAL,
    credentialId,
    credentialDescription,
    Secret.fromString(googleClientIdValue)
)

if (existing) {
    store.updateCredentials(domain, existing, newCredential)
    println("Updated Jenkins credential: ${credentialId}")
} else {
    store.addCredentials(domain, newCredential)
    println("Created Jenkins credential: ${credentialId}")
}

println('Done.')
