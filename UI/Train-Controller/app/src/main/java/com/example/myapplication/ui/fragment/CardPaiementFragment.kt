package com.example.myapplication.ui.fragment

import android.os.Build
import android.os.Bundle
import android.os.Handler
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
import com.example.myapplication.databinding.FragmentCardPaiementBinding
import com.example.myapplication.databinding.FragmentFraudBinding
import org.json.JSONObject

/**
 * A simple [Fragment] subclass.
 * Use the [CardPaiementFragment.newInstance] factory method to
 * create an instance of this fragment.
 */

private const val TAG = "CardPaiementFragment"
class CardPaiementFragment : Fragment() {

    private val args: CashPaiementFragmentArgs by navArgs()
    private var _binding: FragmentCardPaiementBinding? = null
    private val binding get() = _binding!!

    override fun onCreateView(
        inflater: LayoutInflater, container: ViewGroup?,
        savedInstanceState: Bundle?
    ): View? {
        _binding = FragmentCardPaiementBinding.inflate(inflater, container, false)
        val view = binding.root
        return view
    }

    override fun onViewCreated(view: View, savedInstanceState: Bundle?) {
        super.onViewCreated(view, savedInstanceState)

        binding.validBtn .setOnClickListener {
            binding.validBtn.isClickable = false
            doCashPaiement()
        }

    }


    fun doCashPaiement() {

        Log.d(TAG, "onViewCreated: launching request")
        AndroidNetworking
            .put("http://${getString(R.string.NODE_IP_ADDRESS)}:3006/pay/card")
            .addBodyParameter("id", args.fraud.fraudId)
            .addBodyParameter("code",  binding.editTextNumberPassword.text.toString())
            .addBodyParameter("dateExp",  binding.expirationDateTxt.text.toString())
            .addBodyParameter("num",binding.numCardBankInp.text.toString())
            .build()
            .getAsJSONObject(object : JSONObjectRequestListener {
                @RequiresApi(Build.VERSION_CODES.O)
                override fun onResponse(response: JSONObject) {
                    Log.d(TAG, "onResponse: request receive ${response.toString(1)}")

                    // convert the response ( string to boolean or alreadyPaid )
                    // go to the next page
                    if (response.getBoolean("paid")) {
                        findNavController().navigate(
                            CardPaiementFragmentDirections.actionCardPaiementFragmentToFraudCheckingScreen()
                        )
                    } else {
                        Toast.makeText(
                            requireContext(),
                            response.getString("msg"),
                            Toast.LENGTH_LONG
                        ).show()
                    }
                    binding.validBtn.isClickable = true

                }

                override fun onError(error: ANError) {
                    Log.e(TAG, "onError: ${error.errorCode }");
                    Toast.makeText(
                        requireContext(),
                        "un erreur de serveur est survenue, reassayer plus tard",
                        Toast.LENGTH_LONG
                    ).show()

                    binding.validBtn.isClickable = true
                }

            })

    }
}