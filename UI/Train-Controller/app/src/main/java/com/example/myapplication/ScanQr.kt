package com.example.myapplication

import android.content.Context
import android.content.Intent
import android.content.pm.PackageManager
import android.graphics.Bitmap
import android.graphics.BitmapFactory
import android.net.Uri
import android.os.Bundle
import android.os.Environment
import android.provider.MediaStore
import android.util.Log
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.Button
import android.widget.TextView
import android.widget.Toast
import androidx.appcompat.app.AppCompatActivity
import androidx.core.content.FileProvider
import androidx.fragment.app.Fragment
import androidx.lifecycle.ViewModelProviders
import androidx.navigation.findNavController
import com.google.android.gms.vision.Frame
import com.google.android.gms.vision.barcode.Barcode
import com.google.android.gms.vision.barcode.BarcodeDetector
import kotlinx.android.synthetic.main.home_fragment.*
import java.io.File

private const val TAG = "ScanQr"

 class ScanQr : Fragment() , View.OnClickListener{



    private  val REQUEST_CAMERA_PERMISSION = 200
    private  val CAMERA_REQUEST = 101

    private  val SAVED_INSTANCE_URI = "uri"
    private  val SAVED_INSTANCE_RESULT = "result"
    var btnOpenCamera: Button? = null
    var txtResultBody: TextView? = null
    private var detector: BarcodeDetector? = null
    private var imageUri: Uri? = null

    private lateinit var viewModel: ScanQrViewModel



     override fun onClick(v: View) {
         when (v.id) {

             R.id.goScanQRbtn -> startActivity(
                 view.findNavController().navigate(ScanQr())
             )
         }
     }
    override fun onCreateView(
        inflater: LayoutInflater, container: ViewGroup?,
        savedInstanceState: Bundle?
    ): View? {
        return inflater.inflate(R.layout.scan_qr_fragment, container, false)
    }
    override fun onActivityResult(requestCode: Int, resultCode: Int, data: Intent?) {
        super.onActivityResult(requestCode, resultCode, data)
        if (requestCode == CAMERA_REQUEST && resultCode == AppCompatActivity.RESULT_OK) {
            launchMediaScanIntent()
            try {
                val bitmap = decodeBitmapUri(requireContext(), imageUri!!)
                if (detector!!.isOperational && bitmap != null) {
                    val frame = Frame.Builder().setBitmap(bitmap).build()
                    val barcode = detector!!.detect(frame)
                    for (index in 0 until barcode.size()) {
                        val code = barcode.valueAt(index)
                        txtResultBody!!.text = """
                            ${txtResultBody!!.text}
                            ${code.displayValue}
                            
                            """.trimIndent()
                        when (barcode.valueAt(index).valueFormat) {
                            Barcode.CONTACT_INFO -> Log.i(TAG, code.contactInfo.title)
                            Barcode.EMAIL -> Log.i(TAG, code.displayValue)
                            Barcode.ISBN -> Log.i(TAG, code.rawValue)
                            Barcode.PHONE -> Log.i(TAG, code.phone.number)
                            Barcode.PRODUCT -> Log.i(TAG, code.rawValue)
                            Barcode.SMS -> Log.i(TAG, code.sms.message)
                            Barcode.TEXT -> Log.i(TAG, code.displayValue)
                            Barcode.URL -> Log.i(TAG, "url: " + code.displayValue)
                            Barcode.WIFI -> Log.i(TAG, code.wifi.ssid)
                            Barcode.GEO -> Log.i(
                                TAG,
                                code.geoPoint.lat.toString() + ":" + code.geoPoint.lng
                            )
                            Barcode.CALENDAR_EVENT -> Log.i(TAG, code.calendarEvent.description)
                            Barcode.DRIVER_LICENSE -> Log.i(TAG, code.driverLicense.licenseNumber)
                            else -> Log.i(TAG, code.rawValue)
                        }
                    }
                    if (barcode.size() == 0) {
                        txtResultBody!!.text = "No barcode could be detected. Please try again."
                    }
                } else {
                    txtResultBody!!.text = "Detector initialisation failed"
                }
            } catch (e: Exception) {
                Toast.makeText(requireContext(), "Failed to load Image", Toast.LENGTH_SHORT)
                    .show()
                Log.e(TAG, e.toString())
            }
        }
    }

    override fun onActivityCreated(savedInstanceState: Bundle?) {
        super.onActivityCreated(savedInstanceState)
        viewModel = ViewModelProviders.of(this).get(ScanQrViewModel::class.java)

        val detector = BarcodeDetector.Builder(context)
            .setBarcodeFormats(Barcode.DATA_MATRIX or Barcode.QR_CODE)
            .build()
        if (!detector.isOperational) {
            homeNameTxt.text = "Could not set up the detector!"
            return
        }
    }

    private fun takeBarcodePicture() {
        val intent = Intent(MediaStore.ACTION_IMAGE_CAPTURE);
        val photo = File(Environment.getExternalStorageDirectory(), "pic.jpg");
        val imageUri = FileProvider.getUriForFile(
            requireContext(),
            BuildConfig.APPLICATION_ID + ".provider", photo
        );
        intent.putExtra(MediaStore.EXTRA_OUTPUT, imageUri);
        startActivityForResult(intent, CAMERA_REQUEST);
    }



    override fun onSaveInstanceState(outState: Bundle) {
        if (imageUri != null) {
            outState.putString(SAVED_INSTANCE_URI, imageUri.toString());
            outState.putString(SAVED_INSTANCE_RESULT, homeNameTxt.text.toString());
        }
        super.onSaveInstanceState(outState);
    }

    private fun launchMediaScanIntent() {
        val mediaScanIntent = Intent(Intent.ACTION_MEDIA_SCANNER_SCAN_FILE)
        mediaScanIntent.data = imageUri
        requireContext().sendBroadcast(mediaScanIntent)
    }
    override fun onRequestPermissionsResult(
        requestCode: Int,
        permissions: Array<String>,
        grantResults: IntArray
    ) {
        super.onRequestPermissionsResult(requestCode, permissions, grantResults)
        when (requestCode) {
            REQUEST_CAMERA_PERMISSION -> if (grantResults.isNotEmpty() && grantResults[0] == PackageManager.PERMISSION_GRANTED && grantResults[1] == PackageManager.PERMISSION_GRANTED) {
                takeBarcodePicture()
            } else {
                Toast.makeText(requireContext(), "Permission Denied!", Toast.LENGTH_SHORT).show()
            }
        }
    }
     fun  decodeBitmapUri(ctx: Context, uri: Uri) : Bitmap? {
        val targetW = 600;
        val targetH = 600;
        val  bmOptions = BitmapFactory.Options();
        bmOptions.inJustDecodeBounds = true;
        BitmapFactory.decodeStream(ctx.contentResolver.openInputStream(uri), null, bmOptions);
        val photoW = bmOptions.outWidth;
        val photoH = bmOptions.outHeight;

        val scaleFactor = Math.min(photoW / targetW, photoH / targetH);
        bmOptions.inJustDecodeBounds = false;
        bmOptions.inSampleSize = scaleFactor;

        return BitmapFactory.decodeStream(
            ctx.contentResolver
                .openInputStream(uri), null, bmOptions
        );
    }



 }


