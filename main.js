const client = AgoraRTC.createClient({ mode: "rtc", codec: "vp8" });
let localTracks = [];
let remoteUsers = {};

async function startCall() {
  const appId = "8b8a4cda5a3e43c8ad71751ae8b42558"; // ✅ Your App ID
  const channelName = document.getElementById("channel").value;

  if (!channelName) {
    alert("Please enter a channel name");
    return;
  }

  // Join the Agora channel
  await client.join(appId, channelName, null, null);

  // Get local mic and camera
  localTracks = await AgoraRTC.createMicrophoneAndCameraTracks();

  // Show local video
  const localPlayer = document.createElement("div");
  localPlayer.id = "local-player";
  localPlayer.style = "width: 300px; height: 200px;";
  document.getElementById("local-video").append(localPlayer);
  localTracks[1].play("local-player");

  // Publish local tracks
  await client.publish(localTracks);

  // Subscribe to remote users
  client.on("user-published", async (user, mediaType) => {
    await client.subscribe(user, mediaType);

    if (mediaType === "video") {
      const remotePlayer = document.createElement("div");
      remotePlayer.id = `remote-player-${user.uid}`;
      remotePlayer.style = "width: 300px; height: 200px;";
      document.getElementById("remote-video").append(remotePlayer);
      user.videoTrack.play(`remote-player-${user.uid}`);
    }

    if (mediaType === "audio") {
      user.audioTrack.play();
    }
  });

  // Remove remote user video when they leave
  client.on("user-unpublished", user => {
    const remoteElement = document.getElementById(`remote-player-${user.uid}`);
    if (remoteElement) remoteElement.remove();
  });
}