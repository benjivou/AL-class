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
import com.example.myapplication.databinding.FragmentCashPaiementBinding
import org.json.JSONObject

/**
 * A simple [Fragment] subclass.
 * Use the [CashPaiementFragment.newInstance] factory method to
 * create an instance of this fragment.
 */
private const val TAG = "CashPaiementFragment"

class CashPaiementFragment : Fragment() {
    private val args: CashPaiementFragmentArgs by navArgs()

    private var _binding: FragmentCashPaiementBinding? = null
    private val binding get() = _binding!!

    override fun onCreateView(
        inflater: LayoutInflater, container: ViewGroup?,
        savedInstanceState: Bundle?
    ): View? {
        _binding = FragmentCashPaiementBinding.inflate(inflater, container, false)
        val view = binding.root
        return view
    }

    override fun onViewCreated(view: View, savedInstanceState: Bundle?) {
        super.onViewCreated(view, savedInstanceState)
        binding.validBtn2.setOnClickListener {
            binding.validBtn2.isClickable = false
            doCashPaiement()
        }
        binding.textView4.text = getString(
            R.string.je_confirme_que_le_paiement_de_la_somme_de_s_est_bien_effectu,
            args.fraud.fraudPrice.toString()
        )
    }


    fun doCashPaiement() {

        Log.d(TAG, "onViewCreated: launching request")
        AndroidNetworking
            .put("http://${getString(R.string.NODE_IP_ADDRESS)}:3006/pay/cash")
            .addBodyParameter("id", args.fraud.fraudId)
            .addBodyParameter("paid", args.fraud.fraudPrice.toString())
            .build()
            .getAsJSONObject(object : JSONObjectRequestListener {
                @RequiresApi(Build.VERSION_CODES.O)
                override fun onResponse(response: JSONObject) {
                    Log.d(TAG, "onResponse: request receive ${response.toString(1)}")

                    // convert the response ( string to boolean or alreadyPaid )
                    // go to the next page
                    if (response.getBoolean("paid")) {
                        findNavController().navigate(
                            CashPaiementFragmentDirections.actionCashPaiementFragmentToFraudCheckingScreen()
                        )
                    } else {
                        Toast.makeText(
                            requireContext(),
                            response.getString("msg"),
                            Toast.LENGTH_LONG
                        ).show()
                    }
                    binding.validBtn2.isClickable = true

                }

                override fun onError(error: ANError) {
                    Log.e(TAG, "onError: ${error.errorCode }");
                    Toast.makeText(
                        requireContext(),
                        "un erreur de serveur est survenue, reassayer plus tard",
                        Toast.LENGTH_LONG
                    ).show()

                    binding.validBtn2.isClickable = true
                }

            })

    }
}