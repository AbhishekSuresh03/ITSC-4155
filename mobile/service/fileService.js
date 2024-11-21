import { storage } from '../firebaseConfig';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';

export async function uploadProfilePic(uri) {
  const response = await fetch(uri); // fetch the file
  const blob = await response.blob(); // convert the file to a blob
  const fileName = `${Date.now()}_${uri.split('/').pop()}`; // generate a unique file name
  const storageRef = ref(storage, `profile_pics/${fileName}`); // create a storage reference

  await uploadBytes(storageRef, blob); // upload the file to the storage reference
  const downloadURL = await getDownloadURL(storageRef); // get the download URL of the uploaded file

  return downloadURL;
}