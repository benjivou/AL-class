package com.example.myapplication.ui.fragment

import android.Manifest
import android.content.pm.PackageManager
import android.os.Bundle
import android.util.Log
import android.view.LayoutInflater
import android.view.SurfaceHolder
import android.view.View
import android.view.ViewGroup
import android.widget.Toast
import androidx.core.app.ActivityCompat
import androidx.fragment.app.Fragment
import androidx.navigation.findNavController
import androidx.navigation.fragment.findNavController
import com.example.myapplication.R
import com.google.android.gms.vision.CameraSource
import com.google.android.gms.vision.Detector
import com.google.android.gms.vision.Detector.Detections
import com.google.android.gms.vision.barcode.Barcode
import com.google.android.gms.vision.barcode.BarcodeDetector
import kotlinx.android.synthetic.main.scan_qr_fragment.*
import java.io.IOException

private const val TAG = "ScanQrFragment"
class ScanQrFragment : Fragment() {

    private var barcodeDetector: BarcodeDetector? = null
    lateinit var cameraSource: CameraSource

    override fun onCreateView(
        inflater: LayoutInflater,
        container: ViewGroup?,
        savedInstanceState: Bundle?
    ): View? {

        return inflater.inflate(R.layout.scan_qr_fragment, container, false)
    }

    private fun initViews() {
        initialiseDetectorsAndSources()
        btnAction.setOnClickListener {
            requireView().findNavController()
                .navigate(ScanQrFragmentDirections.actionScanQrToTicketInputFragment())
        }
    }

    private fun initialiseDetectorsAndSources() {
        Toast.makeText(requireContext(), "Barcode scanner started", Toast.LENGTH_SHORT).show()
        barcodeDetector = BarcodeDetector.Builder(requireContext())
            .setBarcodeFormats(Barcode.ALL_FORMATS)
            .build()
        cameraSource = CameraSource.Builder(requireContext(), barcodeDetector)
            .setRequestedPreviewSize(1920, 1080)
            .setAutoFocusEnabled(true) //you should add this feature
            .build()
        // ICi c'est la gestion de la view
        surfaceView.holder.addCallback(object : SurfaceHolder.Callback {
            override fun surfaceCreated(holder: SurfaceHolder) {
                try {
                    if (ActivityCompat.checkSelfPermission(
                            requireContext(),
                            Manifest.permission.CAMERA
                        ) == PackageManager.PERMISSION_GRANTED
                    ) {
                        cameraSource.start(surfaceView!!.holder)
                    } else {
                        ActivityCompat.requestPermissions(
                            requireActivity(),
                            arrayOf(Manifest.permission.CAMERA),
                            REQUEST_CAMERA_PERMISSION
                        )
                    }
                } catch (e: IOException) {
                    e.printStackTrace()
                }
            }

            override fun surfaceChanged(
                holder: SurfaceHolder,
                format: Int,
                width: Int,
                height: Int
            ) {
            }

            override fun surfaceDestroyed(holder: SurfaceHolder) {
                cameraSource.stop()
            }
        })
        barcodeDetector!!.setProcessor(object : Detector.Processor<Barcode> {
            override fun release() {
                Toast.makeText(
                    context,
                    "To prevent memory leaks barcode scanner has been stopped",
                    Toast.LENGTH_SHORT
                ).show()
            }

            override fun receiveDetections(detections: Detections<Barcode>) {
                val barcodes = detections.detectedItems
                if (barcodes.size() != 0) {
                    val intentData = barcodes.valueAt(0).displayValue

                    // txtBarcodeValue!!.text = intentData
                    goToNext(intentData)
                }
            }

        })
    }

    override fun onResume() {
        super.onResume()
        initViews()
    }

    override fun onPause() {
        super.onPause()
        cameraSource.release()
    }

    fun goToNext(str: String) {
        Log.d(TAG, "goToNext: ")
        findNavController().navigate(
            ScanQrFragmentDirections.actionScanQrToTicketAnalyserFragment(
                str
            )
        )
    }

    companion object {
        private const val REQUEST_CAMERA_PERMISSION = 201
    }
}