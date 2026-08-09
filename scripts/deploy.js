const { spawn } = require("child_process");

// Warm up the network connection by doing a simple fetch to api.vercel.com
async function warmUpNetwork(retries = 3, delayMs = 1000) {
  for (let i = 1; i <= retries; i++) {
    try {
      console.log(`[Deploy Wrapper] Pre-flight network check (attempt ${i}/${retries})...`);
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000);
      
      const res = await fetch("https://api.vercel.com", {
        method: "HEAD",
        signal: controller.signal
      });
      clearTimeout(timeoutId);
      console.log(`[Deploy Wrapper] Network is active (Status: ${res.status}).`);
      return true;
    } catch (err) {
      console.warn(`[Deploy Wrapper] Pre-flight network check failed: ${err.message}`);
      if (i < retries) {
        console.log(`[Deploy Wrapper] Waiting ${delayMs}ms before retrying...`);
        await new Promise(resolve => setTimeout(resolve, delayMs));
      }
    }
  }
  console.error("[Deploy Wrapper] Pre-flight warning: network could not be verified, attempting deploy anyway.");
  return false;
}

// Run the Vercel CLI command with forced IPv4 DNS lookup order and retry on fetch failure
async function runVercelDeploy(args, attempts = 2) {
  // Extract custom arguments passed to scripts/deploy.js
  const vercelArgs = args.includes('--prod') ? args : [...args];
  
  for (let attempt = 1; attempt <= attempts; attempt++) {
    console.log(`\n[Deploy Wrapper] Running Vercel deployment (Attempt ${attempt}/${attempts})...`);
    
    const env = {
      ...process.env,
      // Force IPv4-first DNS resolution in Node to bypass local IPv6 routing issues
      NODE_OPTIONS: `${process.env.NODE_OPTIONS || ""} --dns-result-order=ipv4first`.trim()
    };

    const hasProd = vercelArgs.includes('--prod');
    console.log(`[Deploy Wrapper] Command: npx vercel ${vercelArgs.join(" ")}`);

    const promise = new Promise((resolve) => {
      const child = spawn("npx", ["vercel", ...vercelArgs], {
        stdio: "inherit",
        env
      });

      child.on("close", (code) => {
        resolve(code);
      });
      
      child.on("error", (err) => {
        console.error(`[Deploy Wrapper] Spawn error:`, err);
        resolve(-1);
      });
    });

    const code = await promise;
    if (code === 0) {
      console.log(`[Deploy Wrapper] Deployment succeeded!`);
      return 0;
    }

    console.warn(`[Deploy Wrapper] Deployment failed with exit code ${code}.`);
    
    if (attempt < attempts) {
      console.log(`[Deploy Wrapper] Waiting 3 seconds before automatic retry...`);
      await new Promise(resolve => setTimeout(resolve, 3000));
    }
  }
  
  console.error(`[Deploy Wrapper] Deployment failed after ${attempts} attempts.`);
  return 1;
}

async function main() {
  const args = process.argv.slice(2);
  await warmUpNetwork();
  const code = await runVercelDeploy(args);
  process.exit(code);
}

main();
