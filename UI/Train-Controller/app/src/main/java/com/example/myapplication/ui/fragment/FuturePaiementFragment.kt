package com.example.myapplication.ui.fragment

import android.os.Build
import android.os.Bundle
import android.util.Log
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.Toast
import androidx.annotation.RequiresApi
import androidx.fragment.app.Fragment
import androidx.navigation.fragment.findNavController
import androidx.navigation.fragment.navArgs
import com.androidnetworking.AndroidNetworking
import com.androidnetworking.error.ANError
import com.androidnetworking.interfaces.JSONObjectRequestListener
import com.example.myapplication.R
import com.example.myapplication.data.models.ClientFraudForm
import com.example.myapplication.databinding.FragmentFuturePaiementBinding
import org.json.JSONObject

private const val TAG = "FuturePaiement"

/**
 * A simple [Fragment] subclass.
 * Use the [FuturePaiementFragment.newInstance] factory method to
 * create an instance of this fragment.
 */
class FuturePaiementFragment : Fragment() {


    private var _binding: FragmentFuturePaiementBinding? = null
    private val binding get() = _binding!!
    val args: FuturePaiementFragmentArgs by navArgs()

    override fun onCreateView(
        inflater: LayoutInflater, container: ViewGroup?,
        savedInstanceState: Bundle?
    ): View? {
        _binding = FragmentFuturePaiementBinding.inflate(inflater, container, false)
        return binding.root
    }

    override fun onViewCreated(view: View, savedInstanceState: Bundle?) {
        super.onViewCreated(view, savedInstanceState)
        binding.apply {
            this.totalfraudTxt.text = getString(R.string.l_amende_est_de_s,args.fraud.fraudPrice.toString())

            goToFraudRecap.setOnClickListener {
                if (checkValidityInputs()) {

                    doCashPaiement()

                }
            }
        }
    }

    private fun checkValidityInputs(): Boolean {

        return true
    }

    fun doCashPaiement() {

        Log.d(TAG, "onViewCreated: launching request")
        AndroidNetworking
            .put("http://${getString(R.string.NODE_IP_ADDRESS)}:3006/pay/later")
            .addBodyParameter("id", args.fraud.fraudId)
            .addBodyParameter("name",  binding.nameFraudTxt .text.toString())
            .addBodyParameter("lastname",  binding.surnamFraudTxt2 .text.toString())
            .addBodyParameter("adress",binding.adresseEmailTxt.text.toString())
            .build()
            .getAsJSONObject(object : JSONObjectRequestListener {
                @RequiresApi(Build.VERSION_CODES.O)
                override fun onResponse(response: JSONObject) {
                    Log.d(TAG, "onResponse: request receive ${response.toString(1)}")

                    // convert the response ( string to boolean or alreadyPaid )
                    // go to the next page
                    if (response.getBoolean("paid")) {
                        findNavController().navigate(
                            FuturePaiementFragmentDirections.actionFuturePaiementToFraudCheckingScreen ()
                        )
                    } else {
                        Toast.makeText(
                            requireContext(),
                            response.getString("msg"),
                            Toast.LENGTH_LONG
                        ).show()
                    }
                    binding.goToFraudRecap.isClickable = true

                }

                override fun onError(error: ANError) {
                    Log.e(TAG, "onError: ${error.errorCode }");
                    Toast.makeText(
                        requireContext(),
                        "un erreur de serveur est survenue, reassayer plus tard",
                        Toast.LENGTH_LONG
                    ).show()

                    binding.goToFraudRecap.isClickable = true
                }

            })

    }
}