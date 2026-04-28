PHASE 1: Install Termux
Download Termux from F-Droid: https://f-droid.org/en/packages/com.termux/
Open Termux

PHASE 2: Base Setup (Run in Termux)
Step 1 — Update packages

```
yes | pkg update && yes | pkg upgrade
```

Step 2 — Install dependencies

```
pkg install -y nodejs git curl cmake make clang binutils
```

Step 3 — Fix network interface error (required for OpenClaw)

```
cat > /data/data/com.termux/files/usr/bin/ifconfig << 'EOF'
#!/data/data/com.termux/files/usr/bin/sh
echo "lo: flags=73<UP,LOOPBACK,RUNNING>  mtu 65536"
echo "        inet 127.0.0.1  netmask 255.0.0.0"
echo "        loop  txqueuelen 1000  (Local Loopback)"
EOF
chmod +x /data/data/com.termux/files/usr/bin/ifconfig
```

PHASE 3: Install OpenClaw
Step 4 — Install OpenClaw CLI

```
npm install -g openclaw
```

Step 5 — Onboard (creates config + workspace)

```
openclaw onboard
```

It will ask for a Telegram Bot Token and Chat ID. If you don't have these yet, you can skip and configure later.

Step 6 — Set your Gemini API key
openclaw auth add google --key "YOUR_GEMINI_API_KEY_HERE"


8716508483:AAGRT8mmikvgvSjiyRXuYku0ILhosy_N73I

8746151947:AAG6W80Cr3EpTVo7ItUrrqBrdNbiqBCUA4w
