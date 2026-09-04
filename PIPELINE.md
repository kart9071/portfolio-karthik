# CI/CD Pipeline — Setup

GitHub Actions builds and ships this repo to the GCP VM on every push to `master`.
Cost: **free**. Public repos get unlimited Actions minutes; private repos get 2,000
min/month, and this pipeline uses roughly 2 minutes per run.

Workflow file: [.github/workflows/pipeline.yml](.github/workflows/pipeline.yml)

## Server facts (confirmed)

| | |
|---|---|
| GCP project | `gen-lang-client-0852212439` |
| Instance | `instance-20260613-180804`, zone `us-west1-b` |
| External IP | `136.118.61.122` (matches DNS for both domains) |
| Nginx web root | `/home/karthikakala13/portfolio/portfolio-karthik/portfolio-app/dist` |
| systemd unit | `portfolio.service` (**not** `portfolio-backend`) |
| Backend dir | `/home/karthikakala13/portfolio/portfolio-karthik/portfolio-backend` |
| venv | `<backend dir>/venv` — inside it, so rsync must exclude `venv/` |
| Network tags | `http-server`, `https-server`, `lb-health-check` |

Note: `~/.ssh/config` on the laptop points `karthik1-instance` at `35.223.179.170` in
project `service-trial-karthik`. That is a different, stale instance — that project
does not even have the Compute API enabled. Ignore it.

---

## What the pipeline does

```
push to master
   │
   ├─ changes ............. works out whether portfolio-app/ or portfolio-backend/ changed
   │
   ├─ build-frontend ...... npm ci → lint → vite build → block plain-HTTP API URLs → upload dist
   ├─ check-backend ....... pip install → boot under gunicorn → hit /api/health + POST /api/contact
   │
   ├─ deploy-frontend ..... rsync dist/ → nginx web root → curl the live site
   └─ deploy-backend ...... back up contacts.db → rsync code (excluding venv/ and the DB)
                            → pip install → systemctl restart portfolio → curl /api/health
```

Pull requests run the build and check jobs but **never** the deploy jobs.
A frontend-only commit does not restart the backend, and vice versa.

---

## One-time setup

### 1. Deploy key — already generated

The keypair exists on your laptop (cmd.exe does not expand `~`, which is why the
original command failed — use `%USERPROFILE%` instead):

```
C:\Users\karth\.ssh\portfolio_deploy       (private -> GitHub secret)
C:\Users\karth\.ssh\portfolio_deploy.pub   (public  -> the VM)
```

Fingerprint: `SHA256:d0JFPFcZSTd46jyxBtG6wBvjAZKSjdQkQGf5RIesHN4`

To regenerate, in cmd.exe:

```
ssh-keygen -t ed25519 -f %USERPROFILE%\.ssh\portfolio_deploy -N "" -C "github-actions-portfolio"
```

### 2. Authorise the key on the VM

Your ISP blocks outbound port 22, so you cannot SSH to the VM from the laptop at all
— use the GCP browser SSH console. `ssh-copy-id` therefore will not work either
(and run on the VM it fails, because the `.pub` file lives on the laptop).

Paste this on the VM instead:

```bash
mkdir -p ~/.ssh && chmod 700 ~/.ssh
echo "ssh-ed25519 AAAAC3NzaC1lZDI1NTE5AAAAIBvaJH/1MAHXfOkchKJfvZyMnZdfPHGGY7eiSpe8VpbQ github-actions-portfolio" >> ~/.ssh/authorized_keys
chmod 600 ~/.ssh/authorized_keys
```

There is no way to verify the key from the laptop under the outbound-22 block. The
first pipeline run is the verification — if the key is wrong, `deploy-frontend` fails
at the rsync step with `Permission denied (publickey)`.

### 3. Let the deploy user restart the service without a password

The backend job runs `sudo systemctl restart portfolio`. Without this rule it blocks
on a password prompt until the job times out. On the VM:

```bash
echo "karthikakala13 ALL=(root) NOPASSWD: /usr/bin/systemctl restart portfolio, /usr/bin/systemctl is-active portfolio" | sudo tee /etc/sudoers.d/portfolio-deploy
sudo chmod 440 /etc/sudoers.d/portfolio-deploy
sudo visudo -c
```

Confirm the binary path matches, or the rule silently fails to apply:

```bash
which systemctl
```

If it reports `/bin/systemctl`, rewrite the rule with that path.

### 4. Web root — already fine, no action needed

Nginx serves:

```
/home/karthikakala13/portfolio/portfolio-karthik/portfolio-app/dist
```

That sits inside `karthikakala13`'s home directory, so the deploy user already owns
it and rsync needs no sudo. Nothing to chown.

It is also inside a git clone of this repo, but `dist/` is gitignored, so rsyncing
into it does not dirty the server's working tree.

### 4b. Backend paths — confirmed

`DEPLOYMENT.md` is wrong on two counts: the unit is **`portfolio.service`**, not
`portfolio-backend.service`, and everything lives inside the repo clone rather than
`~/portfolio-backend`. What is actually running:

```
portfolio.service            loaded active running "Portfolio Flask Backend"
gunicorn --workers 3 --bind 127.0.0.1:8000 app:app
  from /home/karthikakala13/portfolio/portfolio-karthik/portfolio-backend/venv/bin/
```

The gunicorn master has PPID 1, so systemd owns it and it survives reboots.

**The venv sits inside the backend directory.** The deploy rsyncs with `--delete`,
so `venv/` is explicitly excluded — without that, a deploy would delete the running
service's interpreter. Do not remove that exclude.

### 5. Capture the host key

`ssh-keyscan` from a laptop on a network that blocks outbound port 22 (many
residential ISPs do, including this one) will silently return nothing. Read the keys
off the VM instead:

```bash
for f in /etc/ssh/ssh_host_*_key.pub; do echo "136.118.61.122 $(cut -d' ' -f1,2 "$f")"; done
```

That output is already in `known_hosts` format — paste it into the `SSH_KNOWN_HOSTS`
secret verbatim. It pins the server's identity so a deploy cannot be redirected to
another host.

### 6. Add GitHub secrets

`Settings → Secrets and variables → Actions → Secrets → New repository secret`

| Secret | Value |
|---|---|
| `SSH_PRIVATE_KEY` | Full contents of `C:\Users\karth\.ssh\portfolio_deploy`, BEGIN/END lines included |
| `SSH_KNOWN_HOSTS` | Three lines from the step 5 command |
| `SSH_HOST` | `136.118.61.122` |
| `SSH_USER` | `karthikakala13` |

Copy the private key to the clipboard without printing it to a terminal — in cmd.exe:

```
clip < %USERPROFILE%\.ssh\portfolio_deploy
```

### 7. Add GitHub variables

Same page, **Variables** tab. These are paths, not secrets.

| Variable | Value |
|---|---|
| `FRONTEND_ROOT` | `/home/karthikakala13/portfolio/portfolio-karthik/portfolio-app/dist` |
| `BACKEND_DIR` | `/home/karthikakala13/portfolio/portfolio-karthik/portfolio-backend` |
| `VENV_DIR` | `/home/karthikakala13/portfolio/portfolio-karthik/portfolio-backend/venv` |
| `SERVICE_NAME` | `portfolio` (optional — the workflow defaults to this) |
| `VITE_API_URL` | `https://api.karthikshetty.co.in` (optional — `.env.production` already sets it) |

The deploy fails loudly if `FRONTEND_ROOT` or `BACKEND_DIR` does not exist on the
server, rather than creating a directory nginx is not serving.

### 8. Firewall — nothing to do

Port 22 is already open to the internet and always was. Project
`gen-lang-client-0852212439` carries GCP's stock `default-allow-ssh` rule
(`0.0.0.0/0`, `tcp:22`, no target tags, priority 65534) and there are no DENY rules.

A probe from a laptop whose ISP blocks **outbound** 22 looks identical to a closed
server port. Distinguish the two with a control test against a host known to answer
on 22:

```bash
nc -vz github.com 22
```

If that fails too, the block is local to you, not on the server.

The `allow-ssh-deploy` rule added during setup is redundant with `default-allow-ssh`.
Harmless to keep; safe to delete:

```bash
gcloud compute firewall-rules delete allow-ssh-deploy --project=gen-lang-client-0852212439
```

GitHub's runners are on Azure with unrestricted outbound, so they reach port 22 fine
regardless of what your own network allows.

### 8b. Harden sshd — worth doing regardless

Because `default-allow-ssh` has always exposed port 22, this is real risk reduction
rather than a mitigation for anything the pipeline changed. On the VM:

```bash
sudo tee /etc/ssh/sshd_config.d/99-hardening.conf > /dev/null <<'CONF'
PasswordAuthentication no
KbdInteractiveAuthentication no
PermitRootLogin no
CONF
sudo sshd -t && sudo systemctl reload ssh
```

`sudo sshd -t` validates the config before the reload — do not skip it. A broken
sshd config plus a reload can lock you out. Keep an existing session open and
confirm key auth works from a second terminal before closing it.

Then rate-limit the noise:

```bash
sudo apt install -y fail2ban
sudo systemctl enable --now fail2ban
sudo fail2ban-client status sshd
```

---

## First run

Push to `master`, then watch the **Actions** tab. Because the previous commit has no
usable diff base, the first run builds and deploys both sides.

To re-run without a code change, use **Actions → Build & Deploy Portfolio → Run workflow**.

---

## Optional: require approval before deploys

Both deploy jobs declare `environment: production`. In
`Settings → Environments → New environment → production`, add yourself as a required
reviewer. Every deploy then waits for a click. Free on public repos.

---

## Alternative: self-hosted runner (no inbound SSH)

If opening port 22 is unappealing, install a runner **on the VM** itself
(`Settings → Actions → Runners → New self-hosted runner`) and change the deploy jobs
to `runs-on: self-hosted`. The runner polls GitHub outbound, so no inbound port is
needed and no SSH key is involved. The tradeoff is that builds consume the VM's CPU
and RAM, and the runner process must be kept alive as a service.

---

## Rollback

The pipeline deploys whatever is on `master`, so a revert is the rollback:

```bash
git revert <bad-commit>
git push
```

Frontend builds are also kept as workflow artifacts for 7 days, so a known-good
`dist` can be downloaded from a previous run and rsynced by hand if needed.
