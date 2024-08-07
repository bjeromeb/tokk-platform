import React, { useEffect, useState, useRef } from 'react';
// import { S3Client, GetObjectCommand } from '@aws-sdk/client-s3';
// import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
// import { fromCognitoIdentityPool } from '@aws-sdk/credential-provider-cognito-identity';
import ReactPlayer from 'react-player';
import './AudioStreamer.css'; // Make sure to create a corresponding CSS file

interface AudioStreamerProps {
  objectKey: string;
}

const REGION = import.meta.env.VITE_APP_REGION;
// const identityPoolId = import.meta.env.VITE_APP_USER_POOL_ID;
const AUDIO_FILE_BUCKET ="bedrockchatstack-largemessagebucketad0c9b6b-mdwzslwfpwzq";


const AudioStreamer: React.FC<AudioStreamerProps> = ({ objectKey }) => {
  const [audioUrl, setAudioUrl] = useState<string>('');
  const [playing, setPlaying] = useState<boolean>(false);
  const playerRef = useRef<ReactPlayer>(null);
  const bucketName = AUDIO_FILE_BUCKET;
  const region = REGION;
  console.log("region: ", region);
  console.log("bucketName: ", bucketName);

  useEffect(() => {
      const fetchAudioUrl = async () => {
        //   const s3Client = new S3Client({
        //       region,
        //       credentials: fromCognitoIdentityPool({
        //           clientConfig: { region },
        //           identityPoolId,
        //       }),
        //   });
        //   const command = new GetObjectCommand({ Bucket: bucketName, Key: objectKey });
        //   const url = await getSignedUrl(s3Client, command, { expiresIn: 3600 });
          const url = "https://s3.amazonaws.com/"+AUDIO_FILE_BUCKET+"/"+objectKey;
          setAudioUrl(url);
      };
  
    fetchAudioUrl();
  }, [objectKey]);

  const togglePlayPause = () => {
    setPlaying(!playing);
  };

  return (
    <div className="audio-streamer">
      {audioUrl ? (
        <div className="audio-player">
          <button className="play-pause-button" onClick={togglePlayPause}>
            {playing ? 'Pause' : 'Play'}
          </button>
          <ReactPlayer
            ref={playerRef}
            url={audioUrl}
            playing={playing}
            controls={false}
            width="0"
            height="0"
            style={{ display: 'none' }} // Hide the ReactPlayer element
          />
        </div>
      ) : (
        <p>Loading...</p> 
      )}
    </div>
  );
};


export default AudioStreamer;
